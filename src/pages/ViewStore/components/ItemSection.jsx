import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import Text from "../../../components/common/Text";
import Button from "../../../components/common/Button";
import { fetchProducts } from "../../../redux/slices/productSlice";
import EmptyItems from "./EmptyItem";
import ItemSkeleton from "./ItemSkeleton";
import ItemCard from "./ItemCard";
import ItemModal from "./ItemModal";
import { useGetProductsQuery } from "../../../redux/api/productApi";
const ItemSectionContainer = styled.div`
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(Text)`
  font-weight: 600;
  font-size: 1.25rem;
`;
const EditLinkButton = styled(Button)`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const ItemContainer = styled.div`
  display: grid;
  gap: 1rem;

  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  /*  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  @media (max-width: 768px) {
    gap: 0.75rem;
  } */
`;

const ItemSection = () => {
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const { storeId } = useSelector((state) => state.viewStore.storeData);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);

  const {
    data: productData,
    isLoading,
    isFetching,
    isError,
  } = useGetProductsQuery(
    {
      storeId,
      page,
      size: 9,
      sort: "productName,ASC",
    },
    {
      skip: !storeId,
    }
  );

  const products = productData?.content || [];
  const last = productData?.last || false;

  const observerRef = useRef(null);
  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && !isFetching && !last) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    [isFetching, last]
  );

  useEffect(() => {
    if (page === 0) {
      window.scrollTo(0, 0);
    }
  }, [page]);
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0 });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleOpenCreateModal = () => {
    setFormData({
      productName: "",
      description: "",
      originPrice: "",
      salePrice: "",
      stock: "",
      productImg: null,
      storeId,
    });
    setItemModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setFormData({
      ...item,
    });
    setItemModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUploadComplete = (imageUrl) => {
    setFormData((prev) => ({ ...prev, productImg: imageUrl }));
  };

  const resetImage = (type) => {
    setFormData((prev) => ({ ...prev, [type]: null }));
  };

  const closeItemModal = () => {
    setItemModalOpen(false);
    setFormData(null);
  };

  return (
    <ItemSectionContainer>
      <TitleContainer>
        <Title>판매 목록</Title>
        <EditLinkButton data-testid="itemRegistButton" onClick={handleOpenCreateModal}>
          등록하기
        </EditLinkButton>
      </TitleContainer>
      <ItemContainer>
        {isLoading && <ItemSkeleton />}

        {products.length > 0 &&
          products.map((product) => (
            <ItemCard
              key={product.productId}
              item={product}
              onEditClick={() => handleOpenEditModal(product)}
            />
          ))}
      </ItemContainer>

      {isFetching && !isLoading && <ItemSkeleton />}

      {!isFetching && !last && (
        <div ref={observerRef} style={{ height: "10px" }} />
      )}

      {!isFetching && !isLoading && products.length === 0 && (
        <EmptyItems onButtonClick={handleOpenCreateModal} />
      )}

      <ItemModal
        isOpen={itemModalOpen}
        onClose={closeItemModal}
        itemData={formData}
        onFormChange={handleChange}
        onImageUpload={handleImageUploadComplete}
        resetImage={resetImage}
      />
    </ItemSectionContainer>
  );
};

export default ItemSection;
